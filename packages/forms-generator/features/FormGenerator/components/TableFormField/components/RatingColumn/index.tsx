import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { ControlledRating } from '@indocal/ui';
import {
  Form,
  TableFormFieldColumn,
  RatingFormFieldConfig,
} from '@indocal/services';

export interface RatingColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  row: number;
}

export const RatingColumn: React.FC<RatingColumnProps> = ({
  field,
  column,
  row,
}) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<RatingFormFieldConfig | null>(
    () => column.config as RatingFormFieldConfig | null,
    [column.config]
  );

  return (
    <ControlledRating
      name={`${field.id}.${row}.${column.id}`}
      control={control}
      formControlProps={{
        required: config?.required,
        disabled: isSubmitting,
      }}
      formHelperTextProps={{
        sx: {
          marginX: 0,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        },
      }}
      ratingProps={{ size: 'medium', max: config?.levels }}
      controllerProps={{
        rules: {
          required: {
            value: Boolean(config?.required),
            message: 'Debe completar este campo',
          },
        },
      }}
    />
  );
};

export default RatingColumn;
