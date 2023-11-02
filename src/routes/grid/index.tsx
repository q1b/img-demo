import { component$ } from '@builder.io/qwik';
import CloudImage from "../Cloudimage"
export default component$(() => {
  return <div class="grid grid-cols-2 md:grid-cols-4 w-full gap-6">
    {Array.from({length:14}).map((i) => {
      return <CloudImage key={`index-${i}`} layout='constrained' width={400} height={400} src="f38ifyhnrwwy6489aboe" />
    })}
  </div>
});