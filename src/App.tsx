import React, { useState } from 'react';

import Address from '@/components/Address/Address';
import AddressBook from '@/components/AddressBook/AddressBook';
import Button from '@/components/Button/Button';
import InputText from '@/components/InputText/InputText';
import Radio from '@/components/Radio/Radio';
import Section from '@/components/Section/Section';
import useAddressBook from '@/hooks/useAddressBook';

import styles from './App.module.css';
import { Address as AddressType } from './types';
import { useForm } from '@/hooks/useForm';
import Form from '@/components/Form/Form';

const buildQueryString = (params: Record<string, string | number>) => {
  return Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&');
};
function App() {
  /**
   * Form fields states
   * TODO: Write a custom hook to set form fields in a more generic way:
   * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
   * - Hook must expose all text form field values, like so: { postCode: '', houseNumber: '', ...etc }
   * - Remove all individual React.useState
   * - Remove all individual onChange handlers, like handlePostCodeChange for example
   */
  const defaultFields = {
    postCode: '',
    houseNumber: '',
  };
  const defaultFieldsPerson = {
    firstName: '',
    lastName: '',
  };
  const { formFields, handleChange, resetFields } = useForm(defaultFields);
  const {
    formFields: formFieldsPerson,
    handleChange: handleChangePerson,
    resetFields: resetFieldsPerson,
  } = useForm(defaultFieldsPerson);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<
    AddressType | undefined
  >(undefined);
  const { postCode, houseNumber } = formFields;
  const { firstName, lastName } = formFieldsPerson;

  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  /**
   * Text fields onChange handlers
   */

  /** TODO: Fetch addresses based on houseNumber and postCode using the local BE api
   * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
   * - Ensure you provide a BASE URL for api endpoint for grading purposes!
   * - Handle errors if they occur
   * - Handle successful response by updating the `addresses` in the state using `setAddresses`
   * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
   * - Ensure to clear previous search results on each click
   * - Bonus: Add a loading state in the UI while fetching addresses
   */

  const handleAddressSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setIsLoading(true);
    const params = {
      postcode: formFields.postCode || '',
      streetnumber: formFields.houseNumber || '',
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/getAddresses?${buildQueryString(
        params
      )}`
    );
    if (!response.ok) {
      setError('No results found!');
      setIsLoading(false);
      return;
    }
    const data = await response.json();
    setIsLoading(false);

    setAddresses(data.details);
  };

  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */
  const handlePersonSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(addresses);

    if (!selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }
    const foundAddress = addresses.find(
      (address) => address.id === selectedAddress.id
    );
    setSelectedAddress(selectedAddress);

    if (!foundAddress) {
      setError('Selected address not found');
      return;
    }

    addAddress({ ...foundAddress, firstName, lastName });
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}

        <Form
          label="🏠 Find an address"
          formEntries={[
            {
              name: 'postCode',
              placeholder: 'Post Code',
              extraProps: { onChange: handleChange, value: postCode },
            },
            {
              name: 'houseNumber',
              placeholder: 'House number',
              extraProps: { onChange: handleChange, value: houseNumber },
            },
          ]}
          onFormSubmit={handleAddressSubmit}
          submitText="Find"
          loading={isLoading}
        />
        {addresses.length > 0 &&
          addresses.map((address, index) => {
            return (
              <Radio
                name="selectedAddress"
                id={`${index}`}
                key={address.id}
                onChange={() => setSelectedAddress(address)}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {selectedAddress && (
          <Form
            label="✏️ Add personal info to address"
            formEntries={[
              {
                name: 'firstName',
                placeholder: 'First name',
                extraProps: { onChange: handleChangePerson, value: firstName },
              },
              {
                name: 'lastName',
                placeholder: 'Last name',
                extraProps: {
                  onChange: handleChangePerson,
                  value: lastName,
                },
              },
            ]}
            onFormSubmit={handlePersonSubmit}
            submitText="Add to addressbook"
            loading={isLoading}
          />
        )}

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <div className="error">{error}</div>}

        {/* TODO: Add a button to clear all form fields. 
        Button must look different from the default primary button, see design. 
        Button text name must be "Clear all fields"
        On Click, it must clear all form fields, remove all search results and clear all prior
        error messages
        */}
        <Button
          variant="secondary"
          onClick={() => {
            resetFields();
            resetFieldsPerson();
            setError(undefined);
            setSelectedAddress(undefined);
            setAddresses([]);
          }}
        >
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
