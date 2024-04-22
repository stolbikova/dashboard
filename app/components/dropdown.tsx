import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

type OptionI = { value: string; label: string };

function Dropdown({
  options,
  onChange,
  value,
  className,
  name,
}: {
  options: OptionI[];
  onChange: (e: SelectChangeEvent<string>) => void;
  value: OptionI;
  className: string;
  name: string;
}) {
  return (
    <FormControl fullWidth className={className}>
      <InputLabel>{name}</InputLabel>
      <Select
        id="demo-simple-select"
        value={value.value}
        label="Option"
        onChange={onChange}
      >
        {options.map((opt, idx) => (
          <MenuItem value={opt.value} key={idx} role="option">
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default Dropdown;
