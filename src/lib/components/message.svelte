<script>
    export let text;
    export let name;
    export let time;
</script>

<div class="flex flex-col items-start mb-1">
    <div class="flex items-center justify-center">
        <div class="w-8 h-8 rounded-full bg-blue-300" />
        <div class="flex items-center space-x-2 rtl:space-x-reverse">
          <span class="text-sm font-semibold text-gray-900 ml-2">{name}</span>
          <span class="text-sm font-normal text-gray-500">{time}</span>
       </div>
    </div>
    <div class="flex flex-col max-w-[320px] ml-10">
       <p class="text-sm font-normal py-0.5 text-gray-900">{text}</p>
    </div>
 </div>