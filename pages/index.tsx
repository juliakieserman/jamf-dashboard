import styles from '../styles/Home.module.css'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Link from 'next/link';

export default function Home() { 
  return (
    <div className={styles.container}>
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert severity="error"
          action={
            <Button color="inherit" size="small">
              <Link href="/devices"> FIX</Link>
            </Button>
        }>
          There are 3 users with unencrypted harddrives
        </Alert>
        <Alert severity="error"
          action={
            <Button color="inherit" size="small">
              <Link href="/devices"> FIX</Link>
            </Button>
        }>
          There are 3 users with outdated software
        </Alert>
        <Alert severity="error"
          action={
            <Button color="inherit" size="small">
              <Link href="/devices"> FIX</Link>
            </Button>
        }>
          There are 3 users without firewalls
        </Alert>
      </Stack>
    </div>
  )
}
