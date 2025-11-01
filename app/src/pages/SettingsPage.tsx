import { Container, Grid } from '@mui/material';
import { ResourceDataGrid } from '../components/ResourceDataGrid/ResourceDataGrid';
import { RESOURCE_CONFIGS, type ResourceDef } from '../resources/resources';

export const SettingsPage = () => (
  <Container maxWidth="xl" disableGutters>
    <Grid container spacing={2}>
      {RESOURCE_CONFIGS.map((config) => (
        <Grid key={config.key} size={config.cardSize}>
          <ResourceDataGrid<typeof config.schemaType>
            config={config as ResourceDef<typeof config.schemaType>}
          />
        </Grid>
      ))}
    </Grid>
  </Container>
);
