export default interface File {
  open: (path: string) => void;
  save: (path: string, data: any) => void;
}
