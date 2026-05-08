import { useEffect, useState } from "react";

import API from "../services/api";

import {
  Container,
  Typography,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Chip,
} from "@mui/material";

function PriorityInbox() {
  const [notifications, setNotifications] =
    useState([]);

  const [filterType, setFilterType] =
    useState("");

  // Priority weights
  const PRIORITY_WEIGHT = {
    Placement: 3,
    Result: 2,
    Event: 1,
  };

  // Calculate priority score
  const calculatePriorityScore = (
    notification
  ) => {
    const typeWeight =
      PRIORITY_WEIGHT[notification.Type] || 0;

    const currentTime = new Date();

    const notificationTime = new Date(
      notification.Timestamp
    );

    const diffHours =
      (currentTime - notificationTime) /
      (1000 * 60 * 60);

    const recencyScore = Math.max(
      0,
      100 - diffHours
    );

    return typeWeight * 100 + recencyScore;
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      let url =
        "/notifications?limit=50&page=1";

      // Filter support
      if (filterType !== "") {
        url += `&notification_type=${filterType}`;
      }

      const response = await API.get(url);

      const data =
        response.data.notifications;

      // Add score
      const scoredNotifications =
        data.map((notification) => ({
          ...notification,
          priorityScore:
            calculatePriorityScore(
              notification
            ),
        }));

      // Sort descending
      scoredNotifications.sort(
        (a, b) =>
          b.priorityScore - a.priorityScore
      );

      // Keep Top 10
      const top10 =
        scoredNotifications.slice(0, 10);

      setNotifications(top10);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filterType]);

  // Mark viewed
  const markAsViewed = (id) => {
    localStorage.setItem(id, "viewed");
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
      >
        Priority Inbox
      </Typography>

      {/* Filter */}
      <FormControl
        fullWidth
        sx={{ mb: 3 }}
      >
        <InputLabel>
          Filter Notification Type
        </InputLabel>

        <Select
          value={filterType}
          label="Filter Notification Type"
          onChange={(e) =>
            setFilterType(e.target.value)
          }
        >
          <MenuItem value="">
            All
          </MenuItem>

          <MenuItem value="Placement">
            Placement
          </MenuItem>

          <MenuItem value="Result">
            Result
          </MenuItem>

          <MenuItem value="Event">
            Event
          </MenuItem>
        </Select>
      </FormControl>

      <Grid container spacing={3}>
        {notifications.map(
          (notification, index) => {
            const viewed =
              localStorage.getItem(
                notification.ID
              );

            return (
              <Grid
                item
                xs={12}
                md={6}
                key={notification.ID}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    cursor: "pointer",
                    backgroundColor: viewed
                      ? "#f5f5f5"
                      : "#ffffff",
                  }}
                  onClick={() =>
                    markAsViewed(
                      notification.ID
                    )
                  }
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                    >
                      #{index + 1}{" "}
                      {notification.Type}
                    </Typography>

                    <Typography
                      sx={{ mt: 1 }}
                    >
                      {
                        notification.Message
                      }
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ mt: 1 }}
                    >
                      {
                        notification.Timestamp
                      }
                    </Typography>

                    <Typography
                      sx={{ mt: 1 }}
                    >
                      Priority Score:{" "}
                      {notification.priorityScore.toFixed(
                        2
                      )}
                    </Typography>

                    <Chip
                      label={
                        viewed
                          ? "Viewed"
                          : "New"
                      }
                      color={
                        viewed
                          ? "default"
                          : "primary"
                      }
                      sx={{ mt: 2 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            );
          }
        )}
      </Grid>
    </Container>
  );
}

export default PriorityInbox;