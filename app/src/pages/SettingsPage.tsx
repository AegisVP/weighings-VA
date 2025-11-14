import { Container, Grid } from '@mui/material';
import { useEffect, useState } from 'react';

import { ResourceList } from '../components/ResourceList/ResourceList';
import { getResourceConfigs } from '../resources/resources';

import type { ResourceDef, TypeAllResourceDefs } from '../resources/resources';

export const SettingsPage = () => {
  const [resourceConfigs, setResourceConfigs] = useState<TypeAllResourceDefs[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const configs = await getResourceConfigs();
      setResourceConfigs(configs);
    };
    fetchData();
  }, []);

  return (
    <Container maxWidth="xl" disableGutters>
      <Grid container spacing={2}>
        {resourceConfigs.map((config) => (
          <ResourceList<typeof config.schemaType & { id: string }>
            key={config.key}
            config={config as ResourceDef<typeof config.schemaType>}
          />
        ))}
      </Grid>
    </Container>
  );
};
