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

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth();

  const theme = useTheme();

  const { themeStretch } = useSettings();

  return (
    <Layout>
      <Page title="General: App">
        <Container maxWidth={themeStretch ? false : "xl"}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom>
                Hallo
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}></Grid>

            <Grid item xs={12} md={4}></Grid>

            <Grid item xs={12} md={4}></Grid>

            <Grid item xs={12} md={4}></Grid>

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
    </Layout>
  );
}
