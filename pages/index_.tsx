import { useState } from 'react'
import Head from 'next/head'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SCHEDULE_APP_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SCHEDULE_APP_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);


import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function CustomerView() {
  const [availableServices, setAvailableServices] = useState([])
  const getAvailableServices = async() => {
    const { data } = await supabase.from('service').select(`*, scheduler(*)`)
    
    setAvailableServices(data);
  }

  return (
    <>
      <Head>
        <title>Service Scheduling App</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.grid}>
          <a
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Book <span>✋</span>
            </h2>
            <p className={inter.className}>
              Books a stylists based on your availability.
            </p>
          </a>

          {
            availableServices.map(({ description, service, scheduler}) => (
              <a
                href={scheduler.length > 0 ? scheduler[0].nylas_scheduler_url : ""}
                className={styles.card}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h2 className={inter.className}>
                  { service }
                </h2>
                <p className={inter.className}>
                  { description }
                </p>
              </a>
            ))
          }
        </div>
      </main>
    </>
  )
}
