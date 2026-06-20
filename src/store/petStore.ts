import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Pet, VaccineRecord, WeightRecord, FeedingRecord, MedicalRecord } from '@/types';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

interface PetStore {
  pets: Pet[];
  currentPetId: string | null;
  vaccineRecords: VaccineRecord[];
  weightRecords: WeightRecord[];
  feedingRecords: FeedingRecord[];
  medicalRecords: MedicalRecord[];

  setCurrentPetId: (id: string) => void;
  addPet: (pet: Omit<Pet, 'id'>) => string;
  updatePet: (id: string, data: Partial<Omit<Pet, 'id'>>) => void;
  deletePet: (id: string) => void;

  addVaccineRecord: (record: Omit<VaccineRecord, 'id'>) => void;
  updateVaccineRecord: (id: string, data: Partial<Omit<VaccineRecord, 'id' | 'petId'>>) => void;
  deleteVaccineRecord: (id: string) => void;

  addWeightRecord: (record: Omit<WeightRecord, 'id'>) => void;
  updateWeightRecord: (id: string, data: Partial<Omit<WeightRecord, 'id' | 'petId'>>) => void;
  deleteWeightRecord: (id: string) => void;

  addFeedingRecord: (record: Omit<FeedingRecord, 'id'>) => void;
  updateFeedingRecord: (id: string, data: Partial<Omit<FeedingRecord, 'id' | 'petId'>>) => void;
  deleteFeedingRecord: (id: string) => void;

  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  updateMedicalRecord: (id: string, data: Partial<Omit<MedicalRecord, 'id' | 'petId'>>) => void;
  deleteMedicalRecord: (id: string) => void;
}

export const usePetStore = create<PetStore>()(
  persist(
    (set) => ({
      pets: [],
      currentPetId: null,
      vaccineRecords: [],
      weightRecords: [],
      feedingRecords: [],
      medicalRecords: [],

      setCurrentPetId: (id) => set({ currentPetId: id }),

      addPet: (petData) => {
        const id = generateId();
        set((state) => {
          const newPets = [...state.pets, { ...petData, id }];
          return {
            pets: newPets,
            currentPetId: state.currentPetId || id,
          };
        });
        return id;
      },

      updatePet: (id, data) =>
        set((state) => ({
          pets: state.pets.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),

      deletePet: (id) =>
        set((state) => {
          const remaining = state.pets.filter((p) => p.id !== id);
          return {
            pets: remaining,
            currentPetId:
              state.currentPetId === id
                ? remaining.length > 0
                  ? remaining[0].id
                  : null
                : state.currentPetId,
            vaccineRecords: state.vaccineRecords.filter((r) => r.petId !== id),
            weightRecords: state.weightRecords.filter((r) => r.petId !== id),
            feedingRecords: state.feedingRecords.filter((r) => r.petId !== id),
            medicalRecords: state.medicalRecords.filter((r) => r.petId !== id),
          };
        }),

      addVaccineRecord: (record) =>
        set((state) => ({
          vaccineRecords: [...state.vaccineRecords, { ...record, id: generateId() }],
        })),
      updateVaccineRecord: (id, data) =>
        set((state) => ({
          vaccineRecords: state.vaccineRecords.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        })),
      deleteVaccineRecord: (id) =>
        set((state) => ({
          vaccineRecords: state.vaccineRecords.filter((r) => r.id !== id),
        })),

      addWeightRecord: (record) =>
        set((state) => ({
          weightRecords: [...state.weightRecords, { ...record, id: generateId() }],
        })),
      updateWeightRecord: (id, data) =>
        set((state) => ({
          weightRecords: state.weightRecords.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        })),
      deleteWeightRecord: (id) =>
        set((state) => ({
          weightRecords: state.weightRecords.filter((r) => r.id !== id),
        })),

      addFeedingRecord: (record) =>
        set((state) => ({
          feedingRecords: [...state.feedingRecords, { ...record, id: generateId() }],
        })),
      updateFeedingRecord: (id, data) =>
        set((state) => ({
          feedingRecords: state.feedingRecords.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        })),
      deleteFeedingRecord: (id) =>
        set((state) => ({
          feedingRecords: state.feedingRecords.filter((r) => r.id !== id),
        })),

      addMedicalRecord: (record) =>
        set((state) => ({
          medicalRecords: [...state.medicalRecords, { ...record, id: generateId() }],
        })),
      updateMedicalRecord: (id, data) =>
        set((state) => ({
          medicalRecords: state.medicalRecords.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        })),
      deleteMedicalRecord: (id) =>
        set((state) => ({
          medicalRecords: state.medicalRecords.filter((r) => r.id !== id),
        })),
    }),
    {
      name: 'pet-health-journal',
    }
  )
);
