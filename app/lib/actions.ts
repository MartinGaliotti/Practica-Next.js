'use server';

import { z } from 'zod';
import { Invoice } from './definitions';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const createInvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const createInvoiceFormSchema = createInvoiceSchema.omit({
  id: true,
  date: true,
});

export const createInvoice = async (form: FormData) => {
  const { customerId, amount, status } = createInvoiceFormSchema.parse({
    customerId: form.get('customerId'),
    amount: form.get('amount'),
    status: form.get('status'),
  });

  const [date] = new Date().toISOString().split('T');

  await sql`
  INSERT INTO Invoices(customer_id, amount, status, date)
  VALUES(${customerId}, ${amount}, ${status}, ${date})
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
};
