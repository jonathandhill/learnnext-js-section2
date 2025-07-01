import type { Model, GetModelsParams } from '../types';
import supabase from './supabase/client';

export async function getModels({ category }: GetModelsParams = {}): Promise<
  Model[]
> {
  let query = supabase.from('models').select('*');

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error('Failed to fetch models');
  }

  return data || [];
}

export async function getModelById(id: string | number): Promise<Model> {
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Model with id ${id} not found`);
  }

  return data;
}

export async function createModel(modelData: Model): Promise<Model> {
  const { data, error } = await supabase
    .from('models')
    .insert([modelData])
    .select()
    .single();

  if (error) {
    throw new Error('Failed to create model');
  }

  return data;
}