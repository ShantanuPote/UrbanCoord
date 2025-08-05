import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/Card";
import { Badge } from "../../../ui/Badge";
import { Skeleton } from "../../../ui/Skeleton";
import { Calendar, Clock } from "lucide-react";
import { format, isAfter, addDays } from "date-fns";

export default function UpcomingMilestones() {
  const { data: milestones = [], isLoading } = useQuery({
    queryKey: ['/api/milestones', { upcoming: true, limit: 5 }],
  });

  const getUrgencyColor = (dueDate) => {
    const now = new Date();
    const threeDaysFromNow = addDays(now, 3);
    const oneWeekFromNow = addDays(now, 7);

    if (isAfter(now, dueDate)) {
      return 'bg-red-100 text-red-800'; // Overdue
    } else if (isAfter(dueDate, now) && isAfter(threeDaysFromNow, dueDate)) {
      return 'bg-orange-100 text-orange-800'; // Due soon
    } else if (isAfter(dueDate, now) && isAfter(oneWeekFromNow, dueDate)) {
      return 'bg-yellow-100 text-yellow-800'; // Due this week
    }
    return 'bg-blue-100 text-blue-800'; // Future
  };

  const getUrgencyText = (dueDate) => {
    const now = new Date();
    const threeDaysFromNow = addDays(now, 3);
    const oneWeekFromNow = addDays(now, 7);

    if (isAfter(now, dueDate)) {
      return 'Overdue';
    } else if (isAfter(dueDate, now) && isAfter(threeDaysFromNow, dueDate)) {
      return 'Due Soon';
    } else if (isAfter(dueDate, now) && isAfter(oneWeekFromNow, dueDate)) {
      return 'This Week';
    }
    return 'Upcoming';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Upcoming Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Upcoming Milestones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {milestones.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No upcoming milestones</p>
          </div>
        ) : (
          milestones.map((milestone) => (
            <div key={milestone.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">{milestone.title}</h4>
                <Badge className={getUrgencyColor(new Date(milestone.dueDate))} variant="secondary">
                  {getUrgencyText(new Date(milestone.dueDate))}
                </Badge>
              </div>
              
              <div className="flex items-center text-xs text-gray-600">
                <Clock className="h-3 w-3 mr-1" />
                Due: {format(new Date(milestone.dueDate), 'MMM dd, yyyy')}
              </div>

              {milestone.description && (
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                  {milestone.description}
                </p>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}