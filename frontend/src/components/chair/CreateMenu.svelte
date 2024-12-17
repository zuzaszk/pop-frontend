<script>
    import '../../styles/components/ChairMenu.css';
    import { createEventDispatcher } from 'svelte';

    // Initialize dispatcher for communication with parent components
    const dispatch = createEventDispatcher();
  
    // State variable to track whether the dropdown is visible
    let showDropdown = false;
  
    // Toggle the visibility of the dropdown menu
    function toggleDropdown() {
      showDropdown = !showDropdown;
    }
  </script>
  
  <div class="relative">
    <!-- Dropdown toggle button -->
    <button 
      on:click={toggleDropdown} 
      class="text-white hover:bg-[#E74C3C] px-3 py-2 rounded flex items-center"
      aria-haspopup="true" 
      aria-expanded={showDropdown}
    >
      Create
      <span class="ml-1">▼</span>
    </button>

    <!-- Dropdown menu -->
  {#if showDropdown}
    <div class="dropdown-menu">
      <a href="#/create-project" class="dropdown-item">Project</a>
      <a href="#/create-edition" class="dropdown-item">Edition</a>
    </div>
  {/if}
</div>
  