import { Context, useContext } from "react";

export default function useContextOrError<T>(ctx: Context<T | null>) {
  const _ctx = useContext(ctx);
  if (!_ctx) throw new Error(`Please mount ${ctx.displayName}`);
  return _ctx;
}
