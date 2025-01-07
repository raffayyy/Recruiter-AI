import React from 'react';
import { Card } from '../ui/Card';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <Card className="w-full max-w-md">
      <Card.Header>
        <Card.Title className="text-2xl">{title}</Card.Title>
        <Card.Description>{subtitle}</Card.Description>
      </Card.Header>
      <Card.Content>{children}</Card.Content>
    </Card>
  );
}