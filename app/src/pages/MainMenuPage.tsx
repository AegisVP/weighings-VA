import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Scale as ScaleIcon, Assessment as AssessmentIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { useIntl } from 'react-intl';

import { menuLinks } from '../router/sections';
import { useAppSelector } from '../redux/hooks';
import { selectUserLocale } from '../redux/user/userSelectors';
import { constants } from '../constants/constants';

export const MainMenuPage = () => {
  const { formatMessage } = useIntl();
  const locale = useAppSelector(selectUserLocale);
  const today = new Date();
  const formattedDate = today.toLocaleDateString(constants.localeLang[locale], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {/* Welcome Header */}
        <Card sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
            {formatMessage({ id: 'main_page.welcome_title' })}
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            {formattedDate}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mt: 2 }}>
            {formatMessage({ id: 'main_page.welcome_message' })}
          </Typography>
        </Card>

        {/* Getting Started Guide */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 'medium', mb: 2 }}>
            {formatMessage({ id: 'main_page.getting_started_guide' })}
          </Typography>

          <List>
            <ListItem sx={{ alignItems: 'flex-start', mb: 1 }}>
              <ListItemIcon>
                <ScaleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    {formatMessage({ id: 'main_page.getting_started_step1.title' })}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {formatMessage(
                      { id: 'main_page.getting_started_step1.description' },
                      { linkName: formatMessage(menuLinks.weighing.name) }
                    )}
                  </Typography>
                }
              />
            </ListItem>

            <ListItem sx={{ alignItems: 'flex-start', mb: 1 }}>
              <ListItemIcon>
                <AssessmentIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    {formatMessage({ id: 'main_page.getting_started_step2.title' })}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {formatMessage({ id: 'main_page.getting_started_step2.description' })}
                  </Typography>
                }
              />
            </ListItem>

            <ListItem sx={{ alignItems: 'flex-start', mb: 1 }}>
              <ListItemIcon>
                <SettingsIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    {formatMessage({ id: 'main_page.getting_started_step3.title' })}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {formatMessage({ id: 'main_page.getting_started_step3.description' })}
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Card>
      </Box>
    </Container>
  );
};
