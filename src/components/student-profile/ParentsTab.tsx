import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MapPin, Briefcase, CreditCard } from 'lucide-react';

interface ParentsTabProps {
  parents: any[];
}

export const ParentsTab: React.FC<ParentsTabProps> = ({ parents }) => {
  if (!parents || parents.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">No parents linked to this student</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {parents.map((parent: any, index: number) => (
        <Card key={index} className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary/10 text-lg">
                {parent.full_name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h4 className="text-lg font-semibold">{parent.full_name}</h4>
                  <p className="text-sm text-muted-foreground capitalize">{parent.relation_type}</p>
                </div>
                <div className="flex gap-2">
                  {parent.is_primary_contact && (
                    <Badge variant="outline" className="border-primary text-primary">Primary Contact</Badge>
                  )}
                  {parent.is_payer && (
                    <Badge className="bg-success/10 text-success border-success/20">
                      <CreditCard className="w-3 h-3 mr-1" />
                      Payer
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{parent.phone}</p>
                  </div>
                </div>
                
                {parent.email && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium text-sm">{parent.email}</p>
                    </div>
                  </div>
                )}
                
                {parent.occupation && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Workplace</p>
                      <p className="font-medium">{parent.occupation}</p>
                    </div>
                  </div>
                )}
                
                {parent.address && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="font-medium">{parent.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
