import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
const inter = Inter({ subsets: ['latin'] })
import { Input, Button, Textarea, Modal } from '@geist-ui/core'

export default function ServiceModal(
    // TODO: Correct typigns
    { setServiceName, setVisible, modalBindings, showNylas, setServiceDescription, getLatestSchedulers } : 
    { setServiceName: any, setVisible: any, modalBindings: any, showNylas: any, setServiceDescription: any, getLatestSchedulers: any }) {
    return (
      <Modal {...modalBindings}>
        <Modal.Title>New Service</Modal.Title>
        <Modal.Subtitle>Add your new Service!</Modal.Subtitle>
        <Modal.Content>
          <p>Some content contained within the modal.</p>
          <Input placeholder="Enter Service" onInput={(e) => setServiceName(e.target.value)}/><br/><br/>
          <Textarea placeholder="Please enter a description." onInput={(e) => setServiceDescription(e.target.value)}/><br/><br/>
          <Button onClick={showNylas}>Setup/Modify Calendar</Button>
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>Cancel</Modal.Action>
        <Modal.Action passive onClick={() => {
          getLatestSchedulers();
          setVisible(false)
        }}>Add Service</Modal.Action>
      </Modal>
    )
}

const style = {}