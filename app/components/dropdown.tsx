import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

type OptionI = { value: string; label: string };

function Dropdown({
  options,
  onChange,
  value,
  className,
  name,
}: {
  options: OptionI[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: OptionI;
  className: string;
  name: string;
}) {
  return (
    <FormControl fullWidth className={className}>
      <InputLabel id="demo-simple-select-label">{name}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value.label}
        label="Option"
        onChange={onChange}
      >
        {options.map((opt) => (
          <MenuItem value={opt.value}>{opt.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default Dropdown;
