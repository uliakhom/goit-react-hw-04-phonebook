import { useEffect, useState, useRef, useCallback } from 'react';
import { nanoid } from 'nanoid';
import ContactForm from './ContactForm';
import Filter from './Filter';
import ContactList from './ContactList';
import s from './contacts.module.css';
import { initialState } from './initialState';

const Contacts = () => {
  const [contacts, setContacts] = useState([...initialState]);
  const [filter, setFilter] = useState('');

  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      const data = localStorage.getItem('items');
      const items = JSON.parse(data);
      if (data?.length) {
        setContacts(items);
      }
      firstRender.current = false;
    }
    if (!firstRender.current) {
      localStorage.setItem('items', JSON.stringify(contacts));
    }
  }, [contacts]);

  const addContact = item => {
    const repeatedContact = contacts.find(
      contact => contact.number === item.number
    );
    if (repeatedContact) {
      alert(`${item.name} is already in contacts!`);
      return;
    }

    setContacts(prevContacts => {
      const { name, number } = item;
      const newContact = {
        name,
        number,
        id: nanoid(),
      };
      return [...prevContacts, newContact];
    });
  };

  const deleteContact = useCallback(
    id => {
      setContacts(prevContacts => prevContacts.filter(item => item.id !== id));
    },
    [setContacts]
  );

  const filterContact = useCallback(
    ({ target }) => setFilter(target.value),
    [setFilter]
  );
  const filteredName = filter.toLowerCase();
  const filteredContacts = contacts.filter(({ name }) => {
    const result = name.toLowerCase().includes(filteredName);
    return result;
  });

  return (
    <div className={s.container}>
      <div className={s.phonebook}>
        <h1 className={s.title}>Phonebook</h1>
        <ContactForm onSubmit={addContact} />
      </div>
      <div className={s.contacts}>
        <h2 className={s.contacts__title}>Contacts</h2>
        <Filter filterContact={filterContact} filter={filter} />
        <ContactList
          contacts={filteredContacts}
          deleteContact={deleteContact}
        />
      </div>
    </div>
  );
};

export default Contacts;
