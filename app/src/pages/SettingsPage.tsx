import { Container, Grid } from '@mui/material';
import { ResourceList } from '../components/ResourceList/ResourceList';
import { RESOURCE_CONFIGS, type ResourceDef } from '../resources/resources';

export const SettingsPage = () => (
  <Container maxWidth="xl" disableGutters>
    <Grid container spacing={2}>
      {RESOURCE_CONFIGS.map((config) => (
        <ResourceList<typeof config.schemaType>
          key={config.key}
          config={config as ResourceDef<typeof config.schemaType>}
        />
      ))}
    </Grid>
  </Container>
);
