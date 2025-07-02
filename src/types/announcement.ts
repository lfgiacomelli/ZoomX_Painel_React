
export interface Announcement {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementData {
  title: string;
  description: string;
  imageUrl?: string;
  active: boolean;
}

export interface UpdateAnnouncementData extends Partial<CreateAnnouncementData> {}
