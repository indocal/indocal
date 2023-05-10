export type UpdateServiceRequestCommentDto = Partial<{
  isInternal: boolean;
  content: string;
  attachments: File[];
}>;

export default UpdateServiceRequestCommentDto;
