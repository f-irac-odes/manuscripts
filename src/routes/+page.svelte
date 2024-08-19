<script>
	import { World } from "@medieval/sword";
	import { Manuscript } from "../lib/manuscripts";

    const world = new World([]); // Initialize the world with your systems

    $effect.pre(() => {
        const ecsViewer = new Manuscript(world);
        function animate () {
            const delta  = requestAnimationFrame(animate)
            world.runSystems(delta)
        }
        animate()
        return () => ecsViewer.dispose();
    })

    const e = world.createEntity({
            id: 1,
            position: { x: 10, y: 20 },
            health: 100,
            velocity: { x: 1, y: 1 },
        });

        world.createEntity({
            id: 2,
            position: { x: 30, y: 40 },
            health: 80,
            velocity: { x: 0, y: 0 },
        });

        setTimeout(() => {
            world.addComponent(e, 'player', false)
        }, 2000)

</script>