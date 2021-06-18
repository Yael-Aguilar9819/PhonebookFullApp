import styles from "./NotificationMessage.module.css"
const NotificationMessage = ({messageInfo}) => {
  const {message, status} = messageInfo
  if (message === null) {
    return (
      null
    )
  }

  else if (status === "positive") {
    return (
      <div className={styles.positiveContainer}>
        <h2 className={styles.positiveMessage}>{message}</h2>
      </div>
    )  
  }


  //If it's not positive, it will return the negative response
  return (
    <div className={styles.negativeContainer}>
      <h2 className={styles.negativeMessage}>{message}</h2>
    </div>
  )  


  
};
export default NotificationMessage