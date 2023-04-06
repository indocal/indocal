import { useMemo, useCallback } from 'react';
import {
  Box,
  Unstable_Grid2,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

import { Can } from '@indocal/services';

import { useUserRolePermissionsManagementPanel } from '../../context';
import { ScopePermissionsPanel } from '../../types';

export interface ScopePermissionsProps {
  panel: ScopePermissionsPanel;
}

export const ScopePermissions: React.FC<ScopePermissionsProps> = ({
  panel,
}) => {
  const { validating, saving, togglePermission } =
    useUserRolePermissionsManagementPanel();

  const allChecked = useMemo(
    () =>
      panel.subPanels.every((subPanel) =>
        subPanel.permissions.every((permission) => permission.checked)
      ),
    [panel.subPanels]
  );

  const toggleAll = useCallback(() => {
    if (allChecked) {
      panel.subPanels.forEach((subPanel) => {
        subPanel.permissions.forEach((permission) => {
          togglePermission(subPanel.scope, permission.action);
        });
      });
    } else {
      panel.subPanels.forEach((subPanel) => {
        subPanel.permissions
          .filter((permission) => !permission.checked)
          .forEach((permission) => {
            togglePermission(subPanel.scope, permission.action);
          });
      });
    }
  }, [panel.subPanels, allChecked, togglePermission]);

  return (
    <Can I="update" an="userRole" passThrough>
      {(allowed) => (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bolder" color="text.secondary">
              {panel.label}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
              sx={{ marginBottom: (theme) => theme.spacing(1) }}
            >
              <Typography variant="caption" color="text.secondary">
                {`[
                  ${panel.subPanels.reduce(
                    (prev, current) =>
                      prev ? `${prev} / ${current.scope}` : current.scope,
                    ''
                  )}
                ]`}
              </Typography>

              <Box
                sx={{
                  flex: 1,
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              />

              <Checkbox
                disabled={!allowed || validating || saving}
                checked={allChecked}
                onChange={toggleAll}
              />
            </Stack>

            <Stack spacing={2}>
              {panel.subPanels.map((subPanel) => (
                <Stack key={subPanel.scope}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {subPanel.scope}
                    </Typography>

                    <Box
                      sx={{
                        flex: 1,
                        borderBottom: (theme) =>
                          `1px solid ${theme.palette.divider}`,
                      }}
                    />
                  </Stack>

                  <Unstable_Grid2 container spacing={0.25}>
                    {subPanel.permissions.map(({ label, action, checked }) => (
                      <Unstable_Grid2 key={action} sx={{ width: 180 }}>
                        <FormControlLabel
                          label={label}
                          control={
                            <Checkbox
                              disabled={!allowed || validating || saving}
                              checked={checked}
                              onChange={() =>
                                togglePermission(subPanel.scope, action)
                              }
                            />
                          }
                        />
                      </Unstable_Grid2>
                    ))}
                  </Unstable_Grid2>
                </Stack>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}
    </Can>
  );
};

export default ScopePermissions;
