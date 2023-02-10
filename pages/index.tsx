// @ts-nocheck
import { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Input, Button, Textarea, Text, Modal, useModal } from '@geist-ui/core'
import { createClient } from '@supabase/supabase-js'
import NylasLogo from 'public/nylas-logo.png';
import Card from './components/Card';
import ServiceModal from './components/ServiceModal';

const supabaseUrl = process.env.NEXT_PUBLIC_SCHEDULE_APP_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SCHEDULE_APP_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);
const accessToken = process.env.NEXT_PUBLIC_NYLAS_ACCESS_TOKEN;

import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { setVisible, bindings: modalBindings } = useModal()
  const [availableServices, setAvailableServices] = useState([])
  const [existingSchedulerIds, setExistingSchedulerIds] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [newServiceSchedulerUrl, setNewServiceSchedulerUrl] = useState('');
  const [appState, setAppState] = useState('mainRoutes');

  const mainRoutes = [
    {},
    {
      headerLabel: 'Provider',
      headerEmoji: '✋',
      descriptionText: 'Share your availability, create a public calendar and accept bookings!',
      onClick: () => setAppState('providerOptions'),
    },
    {
      headerLabel: 'Book',
      headerEmoji: '📅',
      descriptionText: 'Books a stylists based on your availability.',
      onClick: () => setAppState('userOptions'),
    },
    {}
  ];

  // Note: Considure adding CRUD of provider options
  const providerOptions = [
    ...availableServices.map(data => ({
      headerLabel: data.service,
      descriptionText: data.description,
      onClick: () => {
        showNylas()
      }
    })),
    {
      headerLabel: 'Add',
      headerEmoji: '➕',
      descriptionText: 'Add a new service and create a public calendar with Nylas.',
      onClick: () => {
        setVisible(true)
      }
    },
    {
      headerLabel: 'Go Back',
      headerEmoji: '⬅️',
      onClick: () => setAppState('mainRoutes'),
    }
  ];

  const userOptions = [
    ...availableServices.map(data => ({
      headerLabel: data.service,
      descriptionText: data.description,
      schedulerUrl: data.nylas_scheduler_url.length > 0 ? data.nylas_scheduler_url : "",
    })),
    {
      headerLabel: 'Go Back',
      headerEmoji: '⬅️',
      onClick: () => setAppState('mainRoutes'),
    }
  ];

  const cardViews = {
    mainRoutes,
    providerOptions,
    userOptions,
  }

  const getAvailableServices = async() => {
    const { data } = await supabase.from('service').select(`*, scheduler(*)`)
    setAvailableServices(data);
  }

  // Note: This function grabs new schedulers to save after pressing the `Add Service` button
  const getLatestSchedulers = async() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("https://api.schedule.nylas.com/manage/pages", requestOptions)
      .then(response => response.json())
      .then(result => {
        const data = result.map(s => s.id)
        if(existingSchedulerIds.length === 0) {
          setExistingSchedulerIds(data)
        } else {
          // Note: Filtering for new scheduler IDs after exiting modal
          const newScheduler = result.filter(s => !existingSchedulerIds.includes(s.id))
          if(newScheduler.length === 1) {
            setNewServiceSchedulerUrl(`https://${newScheduler[0].config.page_hostname}/${newScheduler[0].slug}`)
          }
        }
      })
      .catch(error => console.log('error', error));
  }

  const saveService = async(serviceSchedulerUrl: string) => {
    const result = await supabase.from('service').insert({
      service: serviceName,
      description: serviceDescription,
      // Note: Using a single connected account for now
      user_id: 1,
      nylas_scheduler_url: serviceSchedulerUrl,
    })
    await getAvailableServices();
  }

  useEffect(function() {
    if(newServiceSchedulerUrl.length >= 1) {
      saveService(newServiceSchedulerUrl);
      setNewServiceSchedulerUrl('');
    }
  }, [newServiceSchedulerUrl])

  useEffect(function() {
    getAvailableServices();
    getLatestSchedulers();
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
  
    script.src = "https://schedule.nylas.com/schedule-editor/v1.0/schedule-editor.js";
    script.async = true;
  
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const showNylas = useCallback(() => {
    nylas.scheduler.show({
      auth: {
        accessToken, 
      },
      style: {
        tintColor: '#32325d',
        backgroundColor: 'white',
      },
      defaults: {
        event: {
          title: serviceName,
          duration: 30,
        },
      },
    });
  })

  return (
    <>
      <Head>
        <title>Nylas: Service Scheduling App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={style.logoContainer}>
        <Image src={NylasLogo} style={style.nylasLogo}/>
        <Text h1 style={{ marginTop: '18px' }}>Just a Scheduling App.</Text>
      </div>
      <main className={styles.main}>
        <ServiceModal 
          setServiceName={setServiceName}
          setVisible={setVisible}
          modalBindings={modalBindings}
          showNylas={showNylas}
          setServiceDescription={setServiceDescription}
          getLatestSchedulers={getLatestSchedulers}
        />
        <div className={styles.grid}>
         {
          cardViews[appState].map(cardDetails => 
            <Card {...cardDetails} />
          )
         }
        </div>
      </main>
    </>
  )
}

const style = {
  nylasLogo: {
    width: '200px', 
    height: '56px',
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    margin: "64px",
    flexDirection: 'column',
    alignItems: 'center',
    color: '#6DCEFF',
    textShadow: "-1px -1px 0 #080817, 1px -1px 0 #080817, -1px 1px 0 #080817, 1px 1px 0 #080817",
  }
}