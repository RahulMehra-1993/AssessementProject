import { Box, Card, Skeleton, Typography, Breadcrumbs } from "@mui/material";

const QuestionSkeleton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 1,
        marginTop: { lg: "80px" },
        width: { xs: "100%", sm: "90%", md: "80%", lg: "70%", xl: "60%" },
      }}
    >
      <Card
        sx={{
          borderRadius: 10,
          width: "90%",
          minHeight: 250,
          mb: 2,
          p: 1,
          overflow: "hidden",
        }}
      >
        <Skeleton variant="rectangular"  height={10} sx={{ mb: 2 }} />

        <Breadcrumbs sx={{ mb: 2 }}>
          <Skeleton variant="text" width={80} height={20} />
          <Skeleton variant="text" width={50} height={20} />
        </Breadcrumbs>

        <Typography variant="body1" sx={{ mb: 2 }}>
          <Skeleton variant="text" width="80%" height={20} />
        </Typography>

        {[...Array(4)].map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width="100%"
            height={40}
            sx={{ mb: 2, borderRadius: "8px" }}
          />
        ))}

        <Box display="flex" alignItems="center" justifyContent="center">
          <Skeleton variant="circular" width={30} height={30} sx={{ mx: 1 }} />
          <Skeleton variant="circular" width={30} height={30} sx={{ mx: 1 }} />
          <Skeleton variant="circular" width={30} height={30} sx={{ mx: 1 }} />
        </Box>
      </Card>
    </Box>
  );
};

export default QuestionSkeleton;
