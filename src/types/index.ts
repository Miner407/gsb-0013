export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  birthday: string;
  avatarEmoji: string;
  notes: string;
}

export interface VaccineRecord {
  id: string;
  petId: string;
  name: string;
  date: string;
  nextDate: string;
}

export interface WeightRecord {
  id: string;
  petId: string;
  weight: number;
  date: string;
  unit: string;
}

export interface FeedingRecord {
  id: string;
  petId: string;
  date: string;
  time: string;
  foodType: string;
  amount: string;
}

export interface MedicalRecord {
  id: string;
  petId: string;
  date: string;
  hospital: string;
  symptoms: string;
  advice: string;
}
