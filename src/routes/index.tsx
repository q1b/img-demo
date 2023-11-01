import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Cloudimage from "./Cloudimage";
import Image from '~/media/thunder.png?jsx';

export default component$(() => {
  return (
    <>
      <div class="w-64 h-44 bg-violet-400">
        <Cloudimage width={400} layout="constrained" height={600} src="f38ifyhnrwwy6489aboe" />
      </div>
      <Cloudimage layout="fullWidth" width={300} height={800} src="f38ifyhnrwwy6489aboe" />
      <Cloudimage layout="fixed" width={300} height={800} src="t9nbj3plnovuja5brnlj" />
      <Image />
    </>
  );
});

export const head: DocumentHead = {
  title: "Image Optimisation",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
