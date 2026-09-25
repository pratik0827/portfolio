import { defineConfig } from 'jsrepo';

export default defineConfig({
    registries: ["https://reactbits.dev/jsrepo-manifest.json", "react-bits"],
    paths: {
        components: "./src/components"
    }
});
