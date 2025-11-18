import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
  Scale as ScaleIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

export const MainMenuPage = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('uk-UA', {
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
            Вітаємо!
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            {formattedDate}
          </Typography>
        </Card>

        {/* Getting Started Guide */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 'medium', mb: 2 }}>
            Як почати роботу
          </Typography>

          <List>
            <ListItem sx={{ alignItems: 'flex-start', mb: 1 }}>
              <ListItemIcon>
                <ScaleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    1. Створення зважування
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Перейдіть до розділу &quot;Зважування&quot; у верхньому меню для створення нових записів. Введіть
                    дані про культуру, джерело, призначення, вагу та операторів.
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
                    2. Аналіз даних
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    У розділі &quot;Аналіз&quot; ви можете переглядати всі зважування, фільтрувати за різними
                    параметрами, сортувати та переглядати загальну вагу.
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
                    3. Налаштування
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    У розділі &quot;Налаштування&quot; налаштуйте довідники: культури, локації, машини та оператори. Це
                    необхідно для коректної роботи системи.
                  </Typography>
                }
              />
            </ListItem>

            <ListItem sx={{ alignItems: 'flex-start' }}>
              <ListItemIcon>
                <PeopleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    4. Керування користувачами
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Адміністратори можуть керувати користувачами системи у відповідному розділі налаштувань.
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Card>

        {/* Quick Tips */}
        <Card sx={{ p: 3, bgcolor: 'info.lighter' }}>
          <Typography variant="h6" gutterBottom color="info.main" sx={{ fontWeight: 'medium' }}>
            💡 Корисні поради
          </Typography>
          <List dense>
            <ListItem>
              <Typography variant="body2">
                • Використовуйте пошук у фільтрах для швидкого знаходження потрібних записів
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">• Всі зміни зберігаються автоматично після підтвердження</Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                • Натисніть на заголовок колонки в таблиці аналізу для сортування даних
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">• Використовуйте швидкі кнопки дат для вибору популярних періодів</Typography>
            </ListItem>
          </List>
        </Card>
      </Box>
    </Container>
  );
};
