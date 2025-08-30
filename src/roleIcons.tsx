import React from 'react';
import { Shield, Scale, CheckCircle, Stamp } from 'lucide-react';

function hasAny(hay: string, needles: string[]) {
  return needles.some(n => hay.includes(n));
}

export function iconForRoleName(name: string) {
  const n = name.toLowerCase();
  // Shield: охрана, постовые
  if (hasAny(n, ['охран', 'пост', 'security'])) return <Shield className="h-4 w-4" />;
  // Scales: адвокат/юрист/право
  if (hasAny(n, ['адвокат', 'юрист', 'прав'])) return <Scale className="h-4 w-4" />;
  // Check: инспектор/советник/секретарь/контроль
  if (hasAny(n, ['инспектор', 'советник', 'секрет', 'контрол'])) return <CheckCircle className="h-4 w-4" />;
  // Stamp: министр/губернатор/админ/руководитель
  if (hasAny(n, ['министр', 'губернатор', 'админ', 'руковод'])) return <Stamp className="h-4 w-4" />;
  // Fallback
  return <Shield className="h-4 w-4" />;
}

