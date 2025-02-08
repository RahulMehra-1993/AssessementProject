import { CardContent, Skeleton } from "@mui/material";

const CardContentSkelton = () => {
  return (
    <CardContent sx={{height: "250px"}}>
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
  );
};

export default CardContentSkelton;
