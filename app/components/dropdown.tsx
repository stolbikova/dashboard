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
      <InputLabel>{name}</InputLabel>
      <Select
        id="demo-simple-select"
        value={value.label}
        label="Option"
        onChange={onChange}
      >
        {options.map((opt, idx) => (
          <MenuItem idx={idx} value={opt.value} key={idx} role="button">
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default Dropdown;
