import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formFields } from './constants';

interface NoticeFormFieldsProps {
  formData: Record<string, string>;
  handleChange: (id: string, value: string) => void;
  handleGenerateNotice: () => void;
  isEditMode?: boolean;
}

export function NoticeFormFields({
  formData,
  handleChange,
  handleGenerateNotice,
  isEditMode = false,
}: NoticeFormFieldsProps) {
  return (
    <Card variant="elevated" className="animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          공고문 항목 입력
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {formFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Label
                htmlFor={field.id}
                className={cn(
                  'text-sm font-medium',
                  field.isBlueField && 'text-blue-600'
                )}
              >
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-0.5">*</span>
                )}
              </Label>
              {field.sourceLabel && (
                <Badge
                  variant="outline"
                  className="text-[10px] font-normal text-muted-foreground"
                >
                  구매계획서: {field.sourceLabel}
                </Badge>
              )}
              {field.isBlueField && formData[field.id] && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px] gap-1">
                  <Sparkles className="h-2.5 w-2.5" />
                  자동추출
                </Badge>
              )}
            </div>

            {field.type === 'text' && (
              <Input
                id={field.id}
                placeholder={field.placeholder}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                disabled={!isEditMode}
                className={cn(
                  formData[field.id] &&
                    field.isBlueField &&
                    'border-blue-300 bg-blue-50/50 text-blue-900'
                )}
              />
            )}

            {field.type === 'number' && (
              <div className="relative">
                <Input
                  id={field.id}
                  type="text"
                  placeholder={field.placeholder}
                  value={
                    formData[field.id]
                      ? Number(formData[field.id]).toLocaleString()
                      : ''
                  }
                  onChange={(e) =>
                    handleChange(field.id, e.target.value.replace(/,/g, ''))
                  }
                  disabled={!isEditMode}
                  className={cn(
                    formData[field.id] &&
                      field.isBlueField &&
                      'border-blue-300 bg-blue-50/50 text-blue-900'
                  )}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  원
                </span>
              </div>
            )}

            {field.type === 'select' && (
              <Select
                value={formData[field.id]}
                onValueChange={(value) => handleChange(field.id, value)}
                disabled={!isEditMode}
              >
                <SelectTrigger
                  className={cn(
                    formData[field.id] &&
                      field.isBlueField &&
                      'border-blue-300 bg-blue-50/50 text-blue-900'
                  )}
                >
                  <SelectValue placeholder="선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {field.type === 'textarea' && (
              <Textarea
                id={field.id}
                placeholder={field.placeholder}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                disabled={!isEditMode}
                rows={3}
                className={cn(
                  formData[field.id] &&
                    field.isBlueField &&
                    'border-blue-300 bg-blue-50/50 text-blue-900'
                )}
              />
            )}

            {field.type === 'date' && (
              <Input
                id={field.id}
                type="text"
                placeholder={field.placeholder}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                disabled={!isEditMode}
                className={cn(
                  formData[field.id] &&
                    field.isBlueField &&
                    'border-blue-300 bg-blue-50/50 text-blue-900'
                )}
              />
            )}

            {field.hint && (
              <p className="text-xs text-muted-foreground">{field.hint}</p>
            )}
          </div>
        ))}

        <div className="pt-4 flex items-center justify-end">
          {!isEditMode && (
            <Button className="gap-2" onClick={handleGenerateNotice}>
              공고문 생성
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
