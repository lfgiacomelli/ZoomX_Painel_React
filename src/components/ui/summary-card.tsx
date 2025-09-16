import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
export const SummaryCard = ({
  title,
  value,
  description,
  descriptionColor = 'text-gray-600',
}: {
  title: string;
  value: React.ReactNode;
  description?: string;
  descriptionColor?: string;
}) => (
  <Card className="zoomx-card">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-black">{value}</div>
      {description && <p className={`text-xs ${descriptionColor}`}>{description}</p>}
    </CardContent>
  </Card>
);