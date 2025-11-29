# simple rule-based planner: converts workflow definition to ordered tasks
class PlannerAgent:
    """
    Responsible for converting a high-level workflow definition into a sequence of executable steps.
    """
    def plan(self, workflow):
        """
        Generates an execution plan for a workflow.

        Args:
            workflow (Workflow): The workflow object containing the definition.

        Returns:
            list: A list of ordered steps, each containing 'type' and 'payload'.
        """
        # workflow.definition expected: { "steps": [ {"type":"email","template_id":...}, ... ], "schedule": {...} }
        steps = workflow.definition.get("steps", [])
        
        # Current logic: Linear execution (Step 1 -> Step 2 -> ...)
        # Future improvement: Add branching logic or parallel execution here.
        plan = []
        for idx, s in enumerate(steps):
            plan.append({"order": idx, "type": s.get("type"), "payload": s})
            
        return plan

planner_agent = PlannerAgent()
