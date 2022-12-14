// ? @mui
import { useTheme } from "@mui/material/styles";
import { Container, Grid, Stack, Typography } from "@mui/material";
// ? hooks
import useAuth from "../../src/hooks/useAuth";
import useSettings from "../../src/hooks/useSettings";
// ? layouts
import Layout from "../../src/layouts";
// ? components
import Page from "../../src/components/Page";
import AppWidgetSummary from "../../src/sections/@dashboard/general/AppWidgetSummary";

// ----------------------------------------------------------------------

GeneralApp.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth();

  const theme = useTheme();

  const { themeStretch } = useSettings();

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              Hallo
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}></Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Active Users"
              percent={2.6}
              total={18765}
              chartColor={theme.palette.primary.main}
              chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Installed"
              percent={0.2}
              total={4876}
              chartColor={theme.palette.chart.blue[0]}
              chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Downloads"
              percent={-0.1}
              total={678}
              chartColor={theme.palette.chart.red[0]}
              chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}></Grid>

          <Grid item xs={12} md={6} lg={8}></Grid>

          <Grid item xs={12} lg={8}></Grid>

          <Grid item xs={12} md={6} lg={4}></Grid>

          <Grid item xs={12} md={6} lg={4}></Grid>

          <Grid item xs={12} md={6} lg={4}></Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Stack spacing={3}></Stack>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
