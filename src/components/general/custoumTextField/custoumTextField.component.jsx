/* eslint-disable react/prop-types */
import { TextField } from "@mui/material";

const CustoumTextField = ({
  field,
  errors,
  placeholder,
  className,
  rows = 2,
  multiline = true,
}) => {
  const fieldName = field.name;
  return (
    <TextField
      {...field}
      fullWidth
      placeholder={placeholder}
      error={!!errors?.[fieldName]}
      helperText={errors?.[fieldName]?.message}
      className={className}
      multiline={multiline}
      rows={rows}
    />
  );
};

export default CustoumTextField;
