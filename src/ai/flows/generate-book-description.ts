'use server';
/**
 * @fileOverview Generates a book description using an LLM.
 *
 * - generateBookDescription - A function that generates a book description.
 * - GenerateBookDescriptionInput - The input type for the generateBookDescription function.
 * - GenerateBookDescriptionOutput - The return type for the generateBookDescription function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateBookDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  author: z.string().describe('The author of the book.'),
  publicationYear: z.number().describe('The publication year of the book.'),
  country: z.string().describe('The country the book is about.'),
  region: z.string().describe('The region the book is about.'),
});
export type GenerateBookDescriptionInput = z.infer<typeof GenerateBookDescriptionInputSchema>;

const GenerateBookDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated description of the book.'),
});
export type GenerateBookDescriptionOutput = z.infer<typeof GenerateBookDescriptionOutputSchema>;

export async function generateBookDescription(input: GenerateBookDescriptionInput): Promise<GenerateBookDescriptionOutput> {
  return generateBookDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBookDescriptionPrompt',
  input: {
    schema: z.object({
      title: z.string().describe('The title of the book.'),
      author: z.string().describe('The author of the book.'),
      publicationYear: z.number().describe('The publication year of the book.'),
      country: z.string().describe('The country the book is about.'),
      region: z.string().describe('The region the book is about.'),
    }),
  },
  output: {
    schema: z.object({
      description: z.string().describe('The generated description of the book.'),
    }),
  },
  prompt: `You are a book description writer.

  Generate a compelling description for the book based on the following information:

  Title: {{{title}}}
  Author: {{{author}}}
  Publication Year: {{{publicationYear}}}
  Country: {{{country}}}
  Region: {{{region}}}
  `,
});

const generateBookDescriptionFlow = ai.defineFlow<
  typeof GenerateBookDescriptionInputSchema,
  typeof GenerateBookDescriptionOutputSchema
>({
  name: 'generateBookDescriptionFlow',
  inputSchema: GenerateBookDescriptionInputSchema,
  outputSchema: GenerateBookDescriptionOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
