import styles from '../styles/Home.module.css'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import { DeviceRow, Computer } from '../types/types';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import React, { useState, useEffect } from 'react';
import Collapse from '@mui/material/Collapse';


interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

interface DeviceDetailedProps {
  computer: DeviceRow;
}

export default function DeviceDetailed( { computer }: DeviceDetailedProps ) {
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  }

  const getStatusIcon = (computer: DeviceRow) => {
    if ( computer.isValid ) {
      return <CheckCircleOutlineOutlinedIcon color="success"/>;
    }
    return <ErrorOutlinedIcon color="error"/>;
  }

  const getClassName = (status: string) => {
    if ( status === 'error' ) {
      return styles[ status + '-text'];
    }
    return '';
  }

  return (
    <Grid item xs={4}>
      <Item>
        <Card sx={{ minWidth: 275 }}>
          <CardHeader
            avatar={
              <Avatar>
                {getStatusIcon(computer)}
              </Avatar>
            }
            title={computer.emailAddress}
            subheader={computer.lastContactTime}
            />
          <CardContent>
            <Typography variant="h5" component="div">
              { computer.name }
            </Typography>
            <Chip label='Firewall' variant='outlined' className={styles.topBufferSmall} /> 
            <Typography className={getClassName(computer.firewallEnabled.status)}>{computer.firewallEnabled.label}</Typography>
            <br />
            <Chip label='Disk Encryption' variant='outlined' className={styles.topBufferSmall} /> 
            <Typography className={getClassName(computer.diskEncrypted.status)}>{computer.diskEncrypted.label}</Typography>
            <br />
            <Chip label='OS version' variant='outlined' className={styles.topBufferSmall} /> 
            <Typography className={getClassName(computer.osVersion.status)}>{computer.osVersion.label}</Typography>
              <Chip label={computer.ownership} className={styles.topBufferSmall} /> 
              <br />
              {computer.applications.length} running applications
          </CardContent>
         
        <CardActions>
          <Button size="small">Manage</Button>
          <div className={styles.controls}>
            Accounts
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
            </div>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            {computer.localAccounts.map((account, index) => (
                  <div key={index}>
                    <b> Name: </b> {account.name}
                    <br />
                    <b> Is Admin: </b> {account.administrator}
                  <p> ---------------- </p>
                  </div>
            ))}
          </CardContent>
        </Collapse>
      </Card>
    </Item>
  </Grid>
  )
}

