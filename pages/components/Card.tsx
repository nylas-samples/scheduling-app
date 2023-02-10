import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
const inter = Inter({ subsets: ['latin'] })

export default function Card(
    { headerLabel, headerEmoji, descriptionText, schedulerUrl, onClick }: 
    { headerLabel: string, headerEmoji: string, descriptionText: string, schedulerUrl: string, onClick: any }) 
{
  return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={schedulerUrl ?  schedulerUrl : ''}
        onClick={(e) => {
          e.preventDefault()
          onClick && onClick();
          schedulerUrl && window.open(schedulerUrl, '_blank');
        }} 
        className={styles.card}
      >
      <h2 className={inter.className}>
        <span>{headerEmoji}</span>{headerEmoji ? ' ' : '' }{headerLabel}
      </h2>
      <p className={inter.className}>
        {descriptionText}
      </p>
    </a>
  )
}

const style = {}