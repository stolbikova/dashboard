import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Dropdown from "./Dropdown";

describe("Dropdown", () => {
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  it("displays all options when select is opened", async () => {
    render(
      <Dropdown
        options={options}
        onChange={jest.fn()}
        value={options[0]}
        className="dropdown-class"
        name="test-dropdown"
      />
    );

    userEvent.click(screen.getByRole("combobox")); // Open the dropdown

    // Ensure all options are available and visible
    for (const option of options) {
      await screen.findByText(option.label); // Use findByText for asynchronous finding
      expect(screen.getByText(option.label)).toBeInTheDocument();
    }
  });
});
