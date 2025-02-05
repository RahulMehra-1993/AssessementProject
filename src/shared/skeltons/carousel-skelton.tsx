import { Box, Card, CardContent, Skeleton } from "@mui/material";

const CarouselSKeleton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
        minWidth:600,
        width: 'max-content', // Use max-content"
      }}
    >
      {/* Skeleton for LinearProgress (progress bar) */}
      <Skeleton
        variant="rectangular"
        width="90%"
        height={10}
        sx={{ marginBottom: 2 }}
      />
      <Skeleton
        variant="text"
        width="40%"
        height={20}
        sx={{ marginBottom: 2 }}
      />

      {/* Skeleton for Question navigation buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}>
        {[...Array(5)].map((_, index) => (
          <Skeleton
            key={index}
            variant="circular"
            width={35}
            height={35}
            sx={{
              backgroundColor: "#d3d3d3",
            }}
          />
        ))}
      </Box>

      

      {/* Skeleton for Card containing the question */}
      <Card
        sx={{
          borderRadius: 10,
          width: "90%",
          maxWidth: 600,
          minHeight: 250,
          marginBottom: 3,
          padding: 2,
          opacity:.8
        }}
      >
        <CardContent>
          {/* Skeleton for Question text */}
          <Skeleton
            variant="text"
            width="80%"
            height={30}
            sx={{ marginBottom: 2 }}
          />

          {/* Skeleton for Radio options */}
          <Skeleton
            variant="text"
            width="60%"
            height={30}
            sx={{ marginBottom: 1 }}
          />
          <Skeleton
            variant="text"
            width="60%"
            height={30}
            sx={{ marginBottom: 1 }}
          />
          <Skeleton
            variant="text"
            width="60%"
            height={30}
            sx={{ marginBottom: 1 }}
          />
          <Skeleton variant="text" width="60%" height={30} />
        </CardContent>
        {/* Skeleton for Navigation buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 5, mb: 3 }}>
        <Skeleton
          variant="rectangular"
          width={100}
          height={40}
          sx={{ borderRadius: 25 }}
        />
        <Skeleton
          variant="rectangular"
          width={100}
          height={40}
          sx={{ borderRadius: 25 }}
        />
      </Box>

      {/* Skeleton for Snackbar */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={50}
        sx={{ marginTop: 2 }}
      />
      </Card>

      
    </Box>
  );
};

export default CarouselSKeleton;
