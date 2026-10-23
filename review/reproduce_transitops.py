"""Run against TransitOps 9ca404a; stdlib only. Does not modify that repo.
Usage: python review/reproduce_transitops.py /absolute/path/to/TransitOps
"""
import json
import sys
from pathlib import Path
sys.path.insert(0, str(Path(sys.argv[1]) / "backend"))
from models import Bus, Train
from simulation_engine import TransitSimulation
reports = {}
for enabled in (False, True):
    sim = TransitSimulation(
        buses=[Bus(f"B{101+i}") for i in range(4)],
        trains=[Train(train_id="TRAIN-A", scheduled_arrival=12, delay_minutes=5, passengers_for_bus=76),
                Train(train_id="TRAIN-B", scheduled_arrival=32, delay_minutes=2, passengers_for_bus=59)],
        intelligent=enabled, duration=60, traffic_multiplier=1.25, seed=17)
    metrics = sim.run()
    reports["adaptive" if enabled else "baseline"] = {
        **vars(metrics), "average_wait_minutes": metrics.average_wait_minutes}
print(json.dumps(reports, indent=2))
