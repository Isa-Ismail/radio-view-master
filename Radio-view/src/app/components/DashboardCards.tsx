import { Card, CardContent, Grid, Typography } from "@mui/material";
import { NavigationRailIcon } from "./NavigationRail";

export type DashboardCardItem = {
  title: string;
  value: string;
  icon?: string;
};

export default function DashboardCards({
  items = [],
  nonce,
  loading = false,
}: {
  items?: DashboardCardItem[];
  loading?: boolean;
  nonce: string;
}) {
  const itemsPerRow = 12 / items.length;
  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <Typography variant="h6">Please wait while we load data</Typography>
        </div>
      ) : (
        <Grid container spacing={2} id="dashboard-cards">
          {items.map((card) => (
            <Grid item xs={12} md={itemsPerRow} lg={itemsPerRow} key={card.title}>
              <Card
                nonce={nonce}
                sx={{
                  height: 150,
                }}
                className="flex flex-col justify-center">
                <CardContent>
                  <div className="flex items-center">
                    {card.icon && (
                      <NavigationRailIcon
                        size={30}
                        active={true}
                        name={card.icon}></NavigationRailIcon>
                    )}
                    <Typography
                      id={`${card.icon}-dashboard-card-value`}
                      variant="h3"
                      component="div"
                      nonce={nonce}
                      sx={{
                        marginLeft: card.icon ? 2 : 0,
                      }}>
                      {card.value}
                    </Typography>
                  </div>

                  <Typography sx={{ fontSize: 16 }} nonce={nonce}>
                    {card.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
