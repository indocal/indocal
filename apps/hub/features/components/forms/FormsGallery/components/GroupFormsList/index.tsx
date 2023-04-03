import NextLink from 'next/link';
import {
  Paper,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { Create as CreateIcon } from '@mui/icons-material';

import { Can, Form } from '@indocal/services';

import { Pages } from '@/config';

export interface GroupFormsListProps {
  group: Form['group'];
  forms: Form[];
}

export const GroupFormsList: React.FC<GroupFormsListProps> = ({
  group,
  forms,
}) => (
  <List component={Paper} sx={{ width: '100%', height: '100%' }}>
    <ListSubheader>{group.name}</ListSubheader>

    {forms.map((form) => (
      <ListItem key={form.id} divider>
        <ListItemText>{form.title}</ListItemText>

        <Can I="create" a="formEntry">
          <ListItemSecondaryAction>
            <IconButton
              LinkComponent={NextLink}
              href={`${Pages.FORMS}/${form.id}`}
              size="small"
              sx={{ display: 'flex' }}
            >
              <CreateIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </Can>
      </ListItem>
    ))}
  </List>
);

export default GroupFormsList;
