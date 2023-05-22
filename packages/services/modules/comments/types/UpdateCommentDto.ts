export type UpdateCommentDto = Partial<{
  isInternal: boolean;
  content: string;
  attachments: File[];
}>;

export default UpdateCommentDto;
