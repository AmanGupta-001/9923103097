import {
    useEffect,
    useState,
  } from "react";
  
  import API from "../services/api";
  
  import {
    Container,
    Typography,
    Card,
    CardContent,
  } from "@mui/material";
  
  function AllNotifications() {
    const [notifications, setNotifications] =
      useState([]);
  
    useEffect(() => {
      fetchNotifications();
    }, []);
  
    const fetchNotifications = async () => {
      try {
        const response = await API.get(
          "/notifications?limit=20&page=1"
        );
  
        setNotifications(
          response.data.notifications
        );
  
      } catch (error) {
        console.log(error);
      }
    };
  
    return (
      <Container>
        <Typography
          variant="h4"
          sx={{ mt: 4 }}
        >
          All Notifications
        </Typography>
  
        {notifications.map((notification) => (
          <Card
            key={notification.ID}
            sx={{
              mt: 2,
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography variant="h6">
                {notification.Type}
              </Typography>
  
              <Typography>
                {notification.Message}
              </Typography>
  
              <Typography>
                {notification.Timestamp}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Container>
    );
  }
  
  export default AllNotifications;