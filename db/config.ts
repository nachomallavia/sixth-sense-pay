import { defineDb, defineTable, column } from 'astro:db';

// https://astro.build/db/config
export const ContactFormSubmission = defineTable({
  columns:{
    name: column.text(),
    email: column.text(),
    message: column.text({optional: true}),
    locale: column.text(),
  }


});

export default defineDb({
  tables: {
    ContactFormSubmission,
  }
});
